using AutoMapper;
using SmartTutorial.API.Dtos.ThemeDtos;
using SmartTutorial.API.Infrastucture.Models;
using SmartTutorial.API.Repositories.Interfaces;
using SmartTutorial.API.Services.Interfaces;
using SmartTutorial.Domain;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartTutorial.API.Services.Implementations
{
    public class CourseService : ICourseService
    {
        private readonly IMapper _mapper;
        private readonly IRepository _repository;

        public CourseService(IRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IList<CourseDto>> GetAll()
        {
            var courses = await _repository.GetAll<Course>();
            var coursesDto = _mapper.Map<List<CourseDto>>(courses);
            return coursesDto;
        }

        public async Task<CourseDto> Add(AddCourseDto dto)
        {
            var course = new Course() { Name = dto.Name, Description = dto.Description, ImageUrl = dto.ImageUrl };
            await _repository.Add(course);
            await _repository.SaveAll();
            var courseDto = _mapper.Map<CourseDto>(course);
            return courseDto;
        }

        public async Task Delete(int id)
        {
            await _repository.Delete<Course>(id);
            await _repository.SaveAll();
        }

        public async Task<PaginatedResult<CourseDto>> GetPaginated(PagedRequest request)
        {
            var result = await _repository.GetPagedData<Course, CourseDto>(request);
            return result;
        }

        public async Task<CourseWithSubjectsDto> GetWithSubjects(int id)
        {
            var course = await _repository.GetByIdWithInclude<Course>(id, x => x.Subjects);
            var courseDto = _mapper.Map<CourseWithSubjectsDto>(course);
            return courseDto;
        }
    }
}