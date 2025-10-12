using Microsoft.EntityFrameworkCore;
using TeamEventPlanner.Core.Interfaces;
using TeamEventPlanner.Infrastructure.Data;
using TeamEventPlanner.Infrastructure.Repositories;
using TeamEventPlanner.Services;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSwaggerGen();

// Add services
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
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
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontendApps", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",                // React dev
                "https://teameventplanner.netlify.app" // Netlify production
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Middleware
app.UseHttpsRedirection();
app.UseCors("AllowFrontendApps");

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
