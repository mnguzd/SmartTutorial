using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using SmartTutorial.API.Dtos.CourseDtod;
using SmartTutorial.API.Exceptions;
using SmartTutorial.API.Infrastucture.Models;
using SmartTutorial.API.Repositories.Interfaces;
using SmartTutorial.API.Services.Interfaces;
using SmartTutorial.Domain;

namespace SmartTutorial.API.Services
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
            var course = new Course {Name = dto.Name, Description = dto.Description, ImageUrl = dto.ImageUrl};
            await _repository.Add(course, true);
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

        public async Task<CourseDto> Update(int id, AddCourseDto dto)
        {
            var course = await _repository.GetById<Course>(id);
            if (course == null)
            {
                throw new ApiException(HttpStatusCode.NotFound, "Course not found");
            }

            course.Name = dto.Name;
            course.Description = dto.Description;
            course.ImageUrl = dto.ImageUrl;
            await _repository.SaveAll();
            var courseDto = _mapper.Map<CourseDto>(course);
            return courseDto;
        }
    }
}