using Microsoft.EntityFrameworkCore;
using TeamEventPlanner.Core.Interfaces;
using TeamEventPlanner.Infrastructure.Data;
using TeamEventPlanner.Infrastructure.Repositories;
using TeamEventPlanner.Services;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
Bold.Licensing.BoldLicenseProvider.RegisterLicense("nZopOUJqW4rKMbMh8iLz0UcS7K7C3LU7e+eMd09kmkg=");

builder.Services.AddSwaggerGen();
builder.Services.AddControllersWithViews();
//builder.Services.AddBoldReports();

//builder.Services.AddBoldReports();
// Add services
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// Environment-specific Swagger registration
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
}

// Database connection string
var conn = builder.Configuration.GetConnectionString("DefaultConnection")
           ?? "Server=localhost;Database=TeamEventPlannerDb;Trusted_Connection=True;";
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(conn);
});

// Register your services
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<IEventReportService, EventReportService>();

// CORS
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowFrontendApps", policy =>
//    {
//        policy.WithOrigins(
//                "http://localhost:3000",
//                "http://localhost:3002",// React dev
//                "http://localhost:3001",// React dev
//                "https://teameventplanner.netlify.app" // Netlify production
//            )
//            .AllowAnyHeader()
//            .AllowAnyMethod();
//    });
//});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});


var app = builder.Build();

// Middleware
app.UseHttpsRedirection();
app.UseCors("AllowAllOrigins");

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Team Event Planner API V1");
    });

    // Only run migrations & seeding in development
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.Migrate();
        await SeedData.EnsureSeeded(db);
    }
}

app.MapControllers();
app.MapGet("/", () => "Team Event Planner API is running!");

app.Run();
