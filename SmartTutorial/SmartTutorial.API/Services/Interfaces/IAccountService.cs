using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SmartTutorial.API.Dtos.Auth;
using SmartTutorial.API.Dtos.UserDtos;
using SmartTutorial.API.Infrastucture.Models;

namespace SmartTutorial.API.Services.Interfaces
{
    public interface IAccountService
    {
        Task<JwtAuthResult> SignInAsync(string userName, string password);
        Task AddToRole(AddToRoleDto dto);
        Task<PaginatedResult<UserTableDto>> GetPaginated(PagedRequest request);
        Task<JwtAuthResult> Refresh(string refreshToken, DateTime now);
        Task DeleteUser(int id);
        Task<IdentityResult> Logout(string refreshToken);
        Task<IdentityResult> EditUserInfo(string userName, UserEditDto dto);
        Task<IdentityResult> CreateUser(UserForRegisterDto dto);
        Task<string> UploadImage(IFormFile avatar, string userName);
    }
}