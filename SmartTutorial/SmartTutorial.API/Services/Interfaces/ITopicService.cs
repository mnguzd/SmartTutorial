using System.Collections.Generic;
using System.Threading.Tasks;
using SmartTutorial.API.Dtos.TopicDtos;
using SmartTutorial.API.Infrastucture.Models;

namespace SmartTutorial.API.Services.Interfaces
{
    public interface ITopicService
    {
        Task<TopicDto> GetById(int id);
        Task<TopicDto> Add(AddTopicDto dto);
        Task<IList<TopicWithNoContentDto>> GetLightTopics();
        Task<PaginatedResult<TopicDto>> GetPaginated(PagedRequest request);
        Task Delete(int id);
    }
}