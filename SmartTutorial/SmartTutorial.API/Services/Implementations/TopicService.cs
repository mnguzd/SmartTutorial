using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using SmartTutorial.API.Dtos.TopicDtos;
using SmartTutorial.API.Exceptions;
using SmartTutorial.API.Infrastucture.Models;
using SmartTutorial.API.Repositories.Interfaces;
using SmartTutorial.API.Services.Interfaces;
using SmartTutorial.Domain;

namespace SmartTutorial.API.Services.Implementations
{
    public class TopicService : ITopicService
    {
        private readonly IMapper _mapper;
        private readonly IRepository _repository;

        public TopicService(IRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<TopicDto> Add(AddTopicDto dto)
        {
            var topic = new Topic
            {
                Content = dto.Content,
                Name = dto.Name,
                Order = dto.Order,
                SubjectId = dto.SubjectId
            };
            try
            {
                await _repository.Add(topic);
                await _repository.SaveAll();
            }
            catch
            {
                throw new ApiException(HttpStatusCode.BadRequest, "Error with creating this theme");
            }

            var topicDto = _mapper.Map<TopicDto>(topic);
            return topicDto;
        }

        public async Task Delete(int id)
        {
            await _repository.Delete<Topic>(id);
            await _repository.SaveAll();
        }

        public async Task<IList<TopicDto>> GetAll()
        {
            var topics = await _repository.GetAll<Topic>();
            var topicsDto = _mapper.Map<List<TopicDto>>(topics);
            return topicsDto;
        }

        public async Task<TopicDto> GetById(int id)
        {
            var topic = await _repository.GetById<Topic>(id);
            var topicDto = _mapper.Map<TopicDto>(topic);
            return topicDto;
        }

        public async Task<PaginatedResult<TopicDto>> GetPaginated(PagedRequest request)
        {
            var result = await _repository.GetPagedData<Topic, TopicDto>(request);
            return result;
        }

        public async Task<TopicWithQuestionsDto> GetWithQuestions(int id)
        {
            var topic = await _repository.GetByIdWithInclude<Topic>(id, x => x.Questions);
            var topicDto = _mapper.Map<TopicWithQuestionsDto>(topic);
            return topicDto;
        }
    }
}