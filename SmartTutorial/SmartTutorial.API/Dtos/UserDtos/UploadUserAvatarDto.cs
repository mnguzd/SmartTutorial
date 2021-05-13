using Microsoft.AspNetCore.Http;
using SmartTutorial.API.Infrastucture.Attributes;
using System.ComponentModel.DataAnnotations;

namespace SmartTutorial.API.Dtos.UserDtos
{
    public class UploadUserAvatarDto
    {
        [Required]
        [DataType(DataType.Upload)]
        [MaxFileSize(2 * 1024 * 1024)]
        [AllowedExtensions(new[] { ".jpg", ".png",".jpeg" })]
        public IFormFile Avatar { get; set; }
    }
}
