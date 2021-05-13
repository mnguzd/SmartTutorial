using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SmartTutorial.API.Dtos.Auth;
using SmartTutorial.API.Dtos.UserDtos;

namespace SmartTutorial.API.Services.Interfaces
{
    public interface IAccountService
    {
        Task<JwtAuthResult> SignInAsync(string userName, string password);
        Task<JwtAuthResult> Refresh(string refreshToken, DateTime now);
        Task<IdentityResult> Logout(string refreshToken);
        Task<IdentityResult> EditUserInfo(string userName, UserEditDto dto);
        Task<IdentityResult> CreateUser(UserForRegisterDto dto);
        Task<string> UploadImage(IFormFile avatar, string userName);
    }
}