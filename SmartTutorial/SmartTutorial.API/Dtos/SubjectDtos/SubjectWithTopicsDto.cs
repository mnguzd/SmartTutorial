using SmartTutorial.API.Dtos.TopicDtos;
using System.Collections.Generic;

namespace SmartTutorial.API.Dtos.SubjectDtos
{
    public class SubjectWithTopicsDto
    {
        public string Name { get; set; }
        public int Complexity { get; set; }
        public int Id { get; set; }
        public int ThemeId { get; set; }
        public List<TopicDto> Topics { get; set; }
    }
}
