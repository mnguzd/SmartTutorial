using System.ComponentModel.DataAnnotations;

namespace SmartTutorial.API.Dtos.UserDtos
{
    public class AddToRoleDto
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Role { get; set; }
    }
}
