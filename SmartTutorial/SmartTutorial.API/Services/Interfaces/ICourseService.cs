using System.Collections.Generic;
using System.Threading.Tasks;
using SmartTutorial.API.Dtos.CourseDtod;
using SmartTutorial.API.Infrastucture.Models;

namespace SmartTutorial.API.Services.Interfaces
{
    public interface ICourseService
    {
        Task<IList<CourseDto>> GetAll();
        Task<CourseWithSubjectsDto> GetWithSubjects(int id);
        Task<CourseDto> Update(int id, AddCourseDto dto);
        Task<PaginatedResult<CourseDto>> GetPaginated(PagedRequest request);
        Task<CourseDto> Add(AddCourseDto dto);
        Task Delete(int id);
    }
}