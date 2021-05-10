using SmartTutorial.API.Dtos.PaginationDtos.SubjectDtos;
using SmartTutorial.API.Dtos.SubjectDtos;
using SmartTutorial.Domain;
using System.Collections.Generic;
using System.Threading.Tasks;
using SmartTutorial.API.Infrastucture;

namespace SmartTutorial.API.Services.Interfaces
{
    public interface ISubjectService
    {
        Task<Subject> GetById(int id);
        Task<IList<Subject>> GetAll();
        Task<Subject> Add(AddSubjectDto dto);
        Task<Subject> Update(int id, UpdateSubjectDto dto);
        Task<Subject> UpdateWithDetails(int id, PatchSubjectDto dto);
        Task<Subject> GetWithTopics(int id);
        Task<PagedList<Subject>> GetPaginated(SubjectParameters parameters);
        Task Delete(int id);
    }
}