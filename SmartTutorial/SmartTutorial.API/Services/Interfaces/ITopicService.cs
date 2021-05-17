using SmartTutorial.API.Dtos.TopicDtos;
using SmartTutorial.API.Infrastucture.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartTutorial.API.Services.Interfaces
{
    public interface ITopicService
    {
        Task<TopicDto> GetById(int id);
        Task<IList<TopicDto>> GetAll();
        Task<TopicDto> Add(AddTopicDto dto);
        Task<TopicWithQuestionsDto> GetWithQuestions(int id);
        Task<PaginatedResult<TopicDto>> GetPaginated(PagedRequest request);
        Task Delete(int id);
    }
}

