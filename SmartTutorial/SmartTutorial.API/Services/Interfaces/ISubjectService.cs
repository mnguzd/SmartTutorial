using System.Collections.Generic;
using System.Threading.Tasks;
using SmartTutorial.API.Dtos.SubjectDtos;
using SmartTutorial.API.Infrastucture.Models;

namespace SmartTutorial.API.Services.Interfaces
{
    public interface ISubjectService
    {
        Task<SubjectDto> GetById(int id);
        Task<IList<SubjectDto>> GetAll();
        Task<SubjectDto> Add(AddSubjectDto dto);
        Task<SubjectDto> Update(int id, AddSubjectDto dto);
        Task<SubjectWithTopicsDto> GetWithTopics(int id);
        Task<PaginatedResult<SubjectDto>> GetPaginated(PagedRequest request);
        Task Delete(int id);
    }
}