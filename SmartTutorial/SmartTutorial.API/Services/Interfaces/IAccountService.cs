using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SmartTutorial.API.Dtos;
using SmartTutorial.API.Dtos.UserDtos;
using SmartTutorial.Domain.Auth;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SmartTutorial.API.Services.Interfaces
{
    public interface IAccountService
    {
        Task<SignInResult> SignInAsync(string userName, string password);
        Task<JwtAuthResult> GenerateTokens(string username, Claim[] claims, DateTime now);
        Task RemoveRefreshTokenByUserName(string userName);
        Task<JwtAuthResult> Refresh(string refreshToken, string accessToken, DateTime now);
        Task<User> FindByEmail(string email);
        Claim[] GenerateClaims(User user);
        Task<User> FindByUserName(string username);
        Task<IdentityResult> EditUserInfo(User user, UserEditDto dto);
        Task<IdentityResult> CreateUser(UserForRegisterDto dto);
        Task<string> UploadImage(IFormFile avatar, User user);
    }
}
