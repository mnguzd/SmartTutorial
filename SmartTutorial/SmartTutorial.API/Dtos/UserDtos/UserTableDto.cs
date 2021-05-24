namespace SmartTutorial.API.Dtos.UserDtos
{
    public class UserTableDto
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string Role { get; set; }
        public string Country { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string AvatarPath { get; set; }
    }
}
