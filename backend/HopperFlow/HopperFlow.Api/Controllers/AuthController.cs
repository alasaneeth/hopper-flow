using HopperFlow.Application.Common.Interfaces;
using HopperFlow.Application.DTOs;
using HopperFlow.Domain.Entities;
using HopperFlow.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace HopperFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        try
        {
            _logger.LogInformation("Login attempt for {Email}", request.Email);

            var result = await _authService.LoginAsync(request);

            _logger.LogInformation("Login successful for {Email}", request.Email);

            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning("Login failed for {Email}: {Message}",
                request.Email, ex.Message);

            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during login for {Email}",
                request.Email);

            return StatusCode(500, new { message = "An unexpected error occurred" });
        }
    }
    [HttpPost("seed-admin")]
    public async Task<IActionResult> SeedAdmin(
    [FromServices] UserManager<AppUser> userManager)
    {
        var existing = await userManager.FindByEmailAsync("admin@hopperflow.com");
        if (existing != null)
            return BadRequest(new { message = "Admin already exists" });

        var admin = new AppUser
        {
            UserName = "admin@hopperflow.com",
            Email = "admin@hopperflow.com",
            FullName = "HopperFlow Admin",
            Role = UserRole.Admin,
            IsActive = true
        };

        var result = await userManager.CreateAsync(admin, "Admin@123");

        if (result.Succeeded)
            return Ok(new { message = "Admin created successfully" });

        return BadRequest(result.Errors);
    }
}