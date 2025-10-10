using Microsoft.EntityFrameworkCore;
using TeamEventPlanner.Core.Interfaces;
using TeamEventPlanner.Infrastructure.Data;
using TeamEventPlanner.Infrastructure.Repositories;
using TeamEventPlanner.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
    });
var conn = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Server=localhost;Database=TeamEventPlannerDb;Trusted_Connection=True;";
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(conn);
});

builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<IEventReportService, EventReportService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactDev", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // your React frontend
              .AllowAnyHeader() // allows X-Tenant-ID, Content-Type, etc.
              .AllowAnyMethod(); // allows GET, POST, OPTIONS, etc.
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowReactDev");
app.UseHttpsRedirection();
app.MapControllers();

// Ensure DB and seed
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    await SeedData.EnsureSeeded(db);
}

app.MapGet("/", () => "Team Event Planner API is running!");

app.Run();
