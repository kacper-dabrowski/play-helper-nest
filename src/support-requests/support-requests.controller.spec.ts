import { Test, TestingModule } from '@nestjs/testing';
import { fakeCreateSupportRequestDto } from './dto/create-support-request.dto';
import { fakeUpdateSupportRequestDto } from './dto/update-support-request.dto';
import { fakeSupportRequestEntity } from './support-request.entity.fake';
import { SupportRequestsController } from './support-requests.controller';
import { SupportRequestsService } from './support-requests.service';

const fakeSupportRequestService = {
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  get: jest.fn(),
};

describe('SupportRequestsController', () => {
  let controller: SupportRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupportRequestsController],
      providers: [
        {
          provide: SupportRequestsService,
          useValue: fakeSupportRequestService,
        },
      ],
    }).compile();

    controller = module.get<SupportRequestsController>(
      SupportRequestsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an entity and save it in the database', async () => {
    fakeSupportRequestService.create.mockResolvedValue(
      fakeSupportRequestEntity,
    );

    const response = await controller.create(fakeCreateSupportRequestDto);

    expect(response).toEqual({
      success: true,
      ...fakeSupportRequestEntity,
    });
    expect(fakeSupportRequestService.create).toHaveBeenCalledWith(
      fakeCreateSupportRequestDto,
    );
  });

  it('should return unsuccessful response, when failed to create an entity', async () => {
    givenServiceFailsOnMethod(fakeSupportRequestService.create);

    const response = await controller.create(fakeCreateSupportRequestDto);

    expect(response).toEqual({
      success: false,
      error: new Error('error!'),
    });

    expect(fakeSupportRequestService.create).toHaveBeenCalledWith(
      fakeCreateSupportRequestDto,
    );
  });

  it('should return paginated data, when called get method', async () => {
    fakeSupportRequestService.get.mockResolvedValue({
      supportRequests: [fakeSupportRequestEntity],
      hasNextPage: false,
      page: 1,
      totalCount: 1,
    });

    const response = await controller.get('1', '5');

    expect(response).toEqual({
      success: true,
      supportRequests: [fakeSupportRequestEntity],
      hasNextPage: false,
      page: 1,
      totalCount: 1,
    });
    expect(fakeSupportRequestService.get).toHaveBeenCalledWith(1, 5);
  });

  it('should return the first page with perPage=5 by default', async () => {
    fakeSupportRequestService.get.mockResolvedValue({
      supportRequests: [fakeSupportRequestEntity],
      hasNextPage: false,
      page: 1,
      totalCount: 1,
    });

    const response = await controller.get();

    expect(response).toEqual({
      success: true,
      supportRequests: [fakeSupportRequestEntity],
      hasNextPage: false,
      page: 1,
      totalCount: 1,
    });
    expect(fakeSupportRequestService.get).toHaveBeenCalledWith(1, 5);
  });

  it('should return success false and error, when getting documents fails', async () => {
    givenServiceFailsOnMethod(fakeSupportRequestService.get);

    const response = await controller.get('1', '5');

    expect(response).toEqual({
      success: false,
      error: new Error('error!'),
    });
    expect(fakeSupportRequestService.get).toHaveBeenCalledWith(1, 5);
  });

  it('should update requested support request', async () => {
    fakeSupportRequestService.update.mockResolvedValue(
      fakeUpdateSupportRequestDto,
    );

    const response = await controller.update(
      fakeSupportRequestEntity.id,
      fakeUpdateSupportRequestDto,
    );

    expect(response).toEqual({ ...fakeUpdateSupportRequestDto, success: true });
    expect(fakeSupportRequestService.update).toHaveBeenCalledWith(
      fakeSupportRequestEntity.id,
      fakeUpdateSupportRequestDto,
    );
  });

  it('should return success equal to false along with error, when updating fails', async () => {
    givenServiceFailsOnMethod(fakeSupportRequestService.update);

    const response = await controller.update(
      fakeSupportRequestEntity.id,
      fakeUpdateSupportRequestDto,
    );

    expect(response).toEqual({ success: false, error: new Error('error!') });
    expect(fakeSupportRequestService.update).toHaveBeenCalledWith(
      fakeSupportRequestEntity.id,
      fakeUpdateSupportRequestDto,
    );
  });

  it('should return success equal to true, when removing is successful', async () => {
    fakeSupportRequestService.remove.mockResolvedValue(
      fakeSupportRequestEntity,
    );

    const response = await controller.remove(fakeSupportRequestEntity.id);

    expect(response).toEqual({ success: true });
    expect(fakeSupportRequestService.remove).toHaveBeenCalledWith(
      fakeSupportRequestEntity.id,
    );
  });

  it('should return success equal to false along with error, when removing is not successful', async () => {
    givenServiceFailsOnMethod(fakeSupportRequestService.remove);

    const response = await controller.remove(fakeSupportRequestEntity.id);

    expect(response).toEqual({ success: false, error: new Error('error!') });
    expect(fakeSupportRequestService.remove).toHaveBeenCalledWith(
      fakeSupportRequestEntity.id,
    );
  });

  function givenServiceFailsOnMethod(method: () => Promise<any>) {
    jest.mocked(method).mockRejectedValue(new Error('error!'));
  }
});
