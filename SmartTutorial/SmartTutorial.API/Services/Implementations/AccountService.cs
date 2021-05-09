using System;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SmartTutorial.API.Dtos.Auth;
using SmartTutorial.API.Dtos.UserDtos;
using SmartTutorial.API.Infrastucture.Configurations;
using SmartTutorial.API.Services.Interfaces;
using SmartTutorial.Domain.Auth;

namespace SmartTutorial.API.Services.Implementations
{
    public class AccountService : IAccountService
    {
        private readonly AuthOptions _authenticationOptions;
        private readonly IWebHostEnvironment _environment;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;

        public AccountService(IOptions<AuthOptions> authenticationOptions, SignInManager<User> signInManager,
            UserManager<User> userManager, IWebHostEnvironment environment)
        {
            _authenticationOptions = authenticationOptions.Value;
            _signInManager = signInManager;
            _userManager = userManager;
            _environment = environment;
        }

        public async Task<SignInResult> SignInAsync(string userName, string password)
        {
            var signInResult = await _signInManager.PasswordSignInAsync(userName, password, false, false);
            return signInResult;
        }

        public async Task<JwtAuthResult> GenerateTokens(string username, Claim[] claims, DateTime now)
        {
            var shouldAddAudienceClaim =
                string.IsNullOrWhiteSpace(claims?.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Aud)?.Value);

            var signinCredentials = new SigningCredentials(_authenticationOptions.GetSymmetricSecurityKey(),
                SecurityAlgorithms.HmacSha256);

            var jwtToken = new JwtSecurityToken(
                _authenticationOptions.Issuer,
                shouldAddAudienceClaim ? _authenticationOptions.Audience : string.Empty,
                claims,
                expires: now.AddHours(_authenticationOptions.AccessTokenExpiration),
                signingCredentials: signinCredentials
            );
            var accessToken = new JwtSecurityTokenHandler().WriteToken(jwtToken);

            var refreshToken = new RefreshToken
            {
                UserName = username,
                TokenString = GenerateRefreshTokenString(),
                ExpireAt = now.AddDays(_authenticationOptions.RefreshTokenExpiration)
            };
            var userFound = await FindByUserName(username);
            if (userFound == null)
            {
                throw new SecurityTokenException("User with such username not found");
            }

            userFound.RefreshToken = refreshToken.TokenString;
            await _userManager.UpdateAsync(userFound);
            return new JwtAuthResult
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }

        public async Task<Claim[]> GenerateClaims(User user)
        {
            var result = await _userManager.GetRolesAsync(user);
            var role = result.FirstOrDefault();
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Country, user.Country),
                new Claim(ClaimTypes.GivenName, user.FirstName),
                new Claim(ClaimTypes.Surname, user.LastName),
                new Claim("rating", user.Rating.ToString()),
                new Claim("avatar", user.AvatarPath ?? string.Empty),
                new Claim(ClaimTypes.Role, role ?? string.Empty)
            };
            return claims;
        }

        public async Task<JwtAuthResult> Refresh(string refreshToken, DateTime now)
        {
            var userFound = FindByRefreshToken(refreshToken);
            if (userFound == null)
            {
                throw new SecurityTokenException("User with this refresh token do not exists" + refreshToken);
            }

            var claims = await GenerateClaims(userFound);
            var result = await GenerateTokens(userFound.UserName, claims, now);
            return result;
        }

        public async Task<User> FindByEmail(string email)
        {
            var userFound = await _userManager.FindByEmailAsync(email);
            return userFound;
        }

        public async Task<User> FindByUserName(string username)
        {
            var userFound = await _userManager.FindByNameAsync(username);
            return userFound;
        }

        public async Task<IdentityResult> Logout(string refreshToken)
        {
            var userFound = FindByRefreshToken(refreshToken);
            userFound.RefreshToken = "";
            var result = await _userManager.UpdateAsync(userFound);
            return result;
        }

        public async Task<IdentityResult> CreateUser(UserForRegisterDto dto)
        {
            var user = new User
            {
                Email = dto.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = dto.Username
            };
            var createdResult = await _userManager.CreateAsync(user, dto.Password);
            if (createdResult.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "User");
            }

            return createdResult;
        }

        public async Task<IdentityResult> EditUserInfo(User user, UserEditDto dto)
        {
            user.FirstName = dto.Firstname;
            user.LastName = dto.Lastname;
            user.Email = dto.Email;
            if (!string.IsNullOrWhiteSpace(dto.Country))
            {
                user.Country = dto.Country;
            }

            var result = await _userManager.UpdateAsync(user);
            return result;
        }

        public async Task<string> UploadImage(IFormFile avatar, User user)
        {
            try
            {
                if (avatar.Length <= 0)
                {
                    return "Avatar is empty";
                }

                var path = _environment.WebRootPath + "\\UsersImages\\";
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                var oldFilePath = path + Path.GetFileName(user.AvatarPath);
                if (File.Exists(oldFilePath))
                {
                    File.Delete(oldFilePath);
                }

                var randomFileName = Path.GetRandomFileName();
                var pngFileName = Path.ChangeExtension(randomFileName, ".png");
                await using var fileStream = File.Create(path + pngFileName);
                await avatar.CopyToAsync(fileStream);
                await fileStream.FlushAsync();
                const string localServerName = "https://localhost:44314/UsersImages/";
                user.AvatarPath = localServerName + pngFileName;
                await _userManager.UpdateAsync(user);
                return user.AvatarPath;
            }
            catch
            {
                return "Internal server error";
            }
        }

        private static string GenerateRefreshTokenString()
        {
            var randomNumber = new byte[32];
            using var randomNumberGenerator = RandomNumberGenerator.Create();
            randomNumberGenerator.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        private User FindByRefreshToken(string refreshToken)
        {
            var userFound = _userManager.Users.FirstOrDefault(x => x.RefreshToken == refreshToken.Replace(@"""", ""));
            return userFound;
        }
    }
}