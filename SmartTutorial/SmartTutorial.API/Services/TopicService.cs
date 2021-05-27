using AutoMapper;
using SmartTutorial.API.Dtos.TopicDtos;
using SmartTutorial.API.Infrastucture.Models;
using SmartTutorial.API.Repositories.Interfaces;
using SmartTutorial.API.Services.Interfaces;
using SmartTutorial.Domain;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace SmartTutorial.API.Services
{
    public class TopicService : ITopicService
    {
        private readonly IMapper _mapper;
        private readonly IRepository _repository;
        private readonly IConfigurationProvider _provider;

        public TopicService(IRepository repository, IMapper mapper,IConfigurationProvider provider)
        {
            _repository = repository;
            _mapper = mapper;
            _provider = provider;
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
            await _repository.Add(topic, true);
            var topicDto = _mapper.Map<TopicDto>(topic);
            return topicDto;
        }

        public async Task Delete(int id)
        {
            await _repository.Delete<Topic>(id);
            await _repository.SaveAll();
        }

        public async Task<TopicDto> GetById(int id)
        {
            var topic = await _repository.GetById<Topic>(id);
            var topicDto = _mapper.Map<TopicDto>(topic);
            return topicDto;
        }

        public async Task<IList<TopicWithNoContentDto>> GetLightTopics()
        {
            var topics = await _repository.Get<Topic>().ProjectTo<TopicWithNoContentDto>(_provider).ToListAsync();
            return topics;
        }

        public async Task<PaginatedResult<TopicDto>> GetPaginated(PagedRequest request)
        {
            var result = await _repository.GetPagedData<Topic, TopicDto>(request);
            return result;
        }
    }
}