using Microsoft.EntityFrameworkCore;
using WebAppTask.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<ProductContext>(opt => opt.UseInMemoryDatabase("ProductList"));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin() // Erlaube Anfragen von allen Ursprüngen
               .AllowAnyMethod() // Erlaube alle HTTP-Methoden (GET, POST, etc.)
               .AllowAnyHeader(); // Erlaube alle Header
    });
});

var app = builder.Build();


//Starts the swaggerUI to create HTTP-requests
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseCors();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
