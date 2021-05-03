using SmartTutorial.API.Dtos.ThemeDtos;
using System;

namespace SmartTutorial.API.Dtos.SubjectDtos
{
    public class SubjectDto
    {
        public string Name { get; set; }
        public int Complexity { get; set; }
        public int Id { get; set; }
        public DateTime Date { get; set; }
    }
}
