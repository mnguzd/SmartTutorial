using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SmartTutorial.API.Dtos.UserDtos;
using SmartTutorial.API.Infrastucture.Configurations;
using SmartTutorial.Domain.Auth;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SmartTutorial.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AuthOptions _authenticationOptions;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;

        public AccountController(IOptions<AuthOptions> authenticationOptions, SignInManager<User> signInManager,UserManager<User> userManager)
        {
            _authenticationOptions = authenticationOptions.Value;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            var checkingPasswordResult = await _signInManager.PasswordSignInAsync(userForLoginDto.Username, userForLoginDto.Password, false, false);

            if (checkingPasswordResult.Succeeded)
            {
                var signinCredentials = new SigningCredentials(_authenticationOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256);
                var jwtSecurityToken = new JwtSecurityToken(
                     issuer: _authenticationOptions.Issuer,
                     audience: _authenticationOptions.Audience,
                     claims: new List<Claim>(),
                     expires: DateTime.Now.AddDays(30),
                     signingCredentials: signinCredentials
                );

                var tokenHandler = new JwtSecurityTokenHandler();

                var encodedToken = tokenHandler.WriteToken(jwtSecurityToken);

                return Ok(new { AccessToken = encodedToken });
            }  
            return Unauthorized();
        }
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            var userFound = await _userManager.FindByEmailAsync(userForRegisterDto.Email);
            if (userFound != null)
            {
                ModelState.AddModelError("null", "User already exists!");
            }
            User user = new User()
            {
                Email = userForRegisterDto.Email,
                UserName = userForRegisterDto.FirstName + userForRegisterDto.LastName
            };
            var result = await _userManager.CreateAsync(user, userForRegisterDto.Password);
            if (!result.Succeeded)
            {
                ModelState.AddModelError("error", "Something went wrong!");
            }
            return CreatedAtAction("Register",result);
        }
    }
}
