using SmartTutorial.API.Dtos.CourseDtod;
using SmartTutorial.API.Infrastucture.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartTutorial.API.Services.Interfaces
{
    public interface ICourseService
    {
        Task<IList<CourseDto>> GetAll();
        Task<CourseWithSubjectsDto> GetWithSubjects(int id);
        Task<PaginatedResult<CourseDto>> GetPaginated(PagedRequest request);
        Task<CourseDto> Add(AddCourseDto dto); 
        Task Delete(int id);
    }
}