using HopperFlow.Application.Common.Interfaces;
using HopperFlow.Application.DTOs;
using HopperFlow.Domain.Entities;
using HopperFlow.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace HopperFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;
    private readonly UserManager<AppUser> _userManager;


    public AuthController(IAuthService authService, ILogger<AuthController> logger, UserManager<AppUser> userManager)
    {
        _authService = authService;
        _logger = logger;
        _userManager = userManager;
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

    // POST: api/Auth/seed-users
    [HttpPost("seed-users")]
    [AllowAnonymous]
    public async Task<IActionResult> SeedUsers()
    {
        var users = new[]
        {
        new { Email = "manager@hopperflow.com", Password = "Manager@123", FullName = "HopperFlow Manager", Role = "Manager" },
        new { Email = "cashier@hopperflow.com", Password = "Cashier@123", FullName = "HopperFlow Cashier", Role = "Cashier" },
        new { Email = "invmanager@hopperflow.com", Password = "InvMgr@123", FullName = "Inventory Manager", Role = "InventoryManager" },
        new { Email = "prodmanager@hopperflow.com", Password = "ProdMgr@123", FullName = "Production Manager", Role = "ProductionManager" },
        new { Email = "hr@hopperflow.com", Password = "HR@123456", FullName = "HopperFlow HR", Role = "HR" },
    };

        foreach (var u in users)
        {
            var existing = await _userManager.FindByEmailAsync(u.Email);
            if (existing != null) continue;

            var user = new AppUser
            {
                UserName = u.Email,
                Email = u.Email,
                FullName = u.FullName,
                Role = Enum.Parse<UserRole>(u.Role),
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _userManager.CreateAsync(user, u.Password);
        }

        return Ok(new { message = "Users seeded successfully" });
    }
}