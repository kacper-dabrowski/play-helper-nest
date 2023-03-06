import { Test, TestingModule } from '@nestjs/testing';
import { fakeUpdateSupportRequestDto } from '../support-requests/dto/update-support-request.dto';
import { fakeUserEntity } from '../users/user.service.mock';
import { fakeCreateSolutionDto } from './dto/create-solution.dto';
import { fakeSolutionEntity } from './solution.entity.fake';
import { SolutionsController } from './solutions.controller';
import { SolutionsService } from './solutions.service';

const fakeSolutionsService = {
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  getForUser: jest.fn(),
};

describe('SupportRequestsController', () => {
  let controller: SolutionsController;
  const userModel = fakeUserEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolutionsController],
      providers: [
        {
          provide: SolutionsService,
          useValue: fakeSolutionsService,
        },
      ],
    }).compile();

    controller = module.get<SolutionsController>(SolutionsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an entity and save it in the database', async () => {
    fakeSolutionsService.create.mockResolvedValue(fakeSolutionEntity);

    const response = await controller.create(fakeCreateSolutionDto, userModel);

    expect(response).toEqual({
      success: true,
      ...fakeSolutionEntity,
    });
    expect(fakeSolutionsService.create).toHaveBeenCalledWith(
      fakeCreateSolutionDto,
      userModel.id,
    );
  });

  it('should return unsuccessful response, when failed to create an entity', async () => {
    givenServiceFailsOnMethod(fakeSolutionsService.create);

    const response = await controller.create(fakeCreateSolutionDto, userModel);

    expect(response).toEqual({
      success: false,
      error: new Error('error!'),
    });

    expect(fakeSolutionsService.create).toHaveBeenCalledWith(
      fakeCreateSolutionDto,
      userModel.id,
    );
  });

  it('should return paginated data, when called get method', async () => {
    fakeSolutionsService.getForUser.mockResolvedValue({
      entities: [fakeSolutionEntity],
      hasNextPage: false,
      page: 1,
      totalCount: 1,
    });

    const response = await controller.get('1', '1', userModel);

    expect(response).toEqual({
      success: true,
      entities: [fakeSolutionEntity],
      hasNextPage: false,
      page: 1,
      totalCount: 1,
    });
    expect(fakeSolutionsService.getForUser).toHaveBeenCalledWith({
      authorId: '5f6d0d6f4f6a7b6b6b6b6b6',
      page: 1,
      perPage: 1,
    });
  });

  it('should return the first page with perPage=5 by default', async () => {
    fakeSolutionsService.getForUser.mockResolvedValue({
      entities: [fakeSolutionEntity],
      hasNextPage: false,
      page: 1,
      totalCount: 1,
    });

    const response = await controller.get(undefined, undefined, userModel);

    expect(response).toEqual({
      success: true,
      entities: [fakeSolutionEntity],
      hasNextPage: false,
      page: 1,
      totalCount: 1,
    });
    expect(fakeSolutionsService.getForUser).toHaveBeenCalledWith({
      authorId: '5f6d0d6f4f6a7b6b6b6b6b6',
      page: 1,
      perPage: 5,
    });
  });

  it('should return success false and error, when getting documents fails', async () => {
    givenServiceFailsOnMethod(fakeSolutionsService.getForUser);

    const response = await controller.get('1', '5', userModel);

    expect(response).toEqual({
      success: false,
      error: new Error('error!'),
    });
    expect(fakeSolutionsService.getForUser).toHaveBeenCalledWith({
      authorId: '5f6d0d6f4f6a7b6b6b6b6b6',
      page: 1,
      perPage: 5,
    });
  });

  it('should update requested support request', async () => {
    fakeSolutionsService.update.mockResolvedValue(fakeUpdateSupportRequestDto);

    const response = await controller.update(
      fakeSolutionEntity.id,
      fakeUpdateSupportRequestDto,
    );

    expect(response).toEqual({ ...fakeUpdateSupportRequestDto, success: true });
    expect(fakeSolutionsService.update).toHaveBeenCalledWith(
      fakeSolutionEntity.id,
      fakeUpdateSupportRequestDto,
    );
  });

  it('should return success equal to false along with error, when updating fails', async () => {
    givenServiceFailsOnMethod(fakeSolutionsService.update);

    const response = await controller.update(
      fakeSolutionEntity.id,
      fakeUpdateSupportRequestDto,
    );

    expect(response).toEqual({ success: false, error: new Error('error!') });
    expect(fakeSolutionsService.update).toHaveBeenCalledWith(
      fakeSolutionEntity.id,
      fakeUpdateSupportRequestDto,
    );
  });

  it('should return success equal to true, when removing is successful', async () => {
    fakeSolutionsService.remove.mockResolvedValue(fakeSolutionEntity);

    const response = await controller.remove(fakeSolutionEntity.id);

    expect(response).toEqual({ success: true });
    expect(fakeSolutionsService.remove).toHaveBeenCalledWith(
      fakeSolutionEntity.id,
    );
  });

  it('should return success equal to false along with error, when removing is not successful', async () => {
    givenServiceFailsOnMethod(fakeSolutionsService.remove);

    const response = await controller.remove(fakeSolutionEntity.id);

    expect(response).toEqual({ success: false, error: new Error('error!') });
    expect(fakeSolutionsService.remove).toHaveBeenCalledWith(
      fakeSolutionEntity.id,
    );
  });

  function givenServiceFailsOnMethod(method: () => Promise<any>) {
    jest.mocked(method).mockRejectedValue(new Error('error!'));
  }
});
