using System.Text.Json.Serialization;

namespace SmartTutorial.API.Dtos.Auth
{
    public class RefreshTokenDto
    {
        [JsonPropertyName("refreshToken")]
        public string RefreshToken { get; set; }
    }
}
