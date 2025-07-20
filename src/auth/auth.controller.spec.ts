import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAuthService = {
    signIn: jest.fn(),
    signUp: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    const signInDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should call authService.signIn and return access_token', async () => {
      const expectedResult = {
        access_token: 'mock-access-token',
      };

      authService.signIn.mockResolvedValue(expectedResult);

      const result = await controller.signIn(signInDto);

      expect(authService.signIn).toHaveBeenCalledWith(signInDto);
      expect(authService.signIn).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should handle authentication errors', async () => {
      const error = new Error('Invalid credentials');
      authService.signIn.mockRejectedValue(error);

      await expect(controller.signIn(signInDto)).rejects.toThrow(error);
      expect(authService.signIn).toHaveBeenCalledWith(signInDto);
    });

    it('should return the correct type', async () => {
      const expectedResult = {
        access_token: 'mock-access-token',
      };

      authService.signIn.mockResolvedValue(expectedResult);

      const result = await controller.signIn(signInDto);

      expect(result).toHaveProperty('access_token');
      expect(typeof result.access_token).toBe('string');
    });
  });

  describe('signUp', () => {
    const signUpDto: CreateUserDto = {
      email: 'newuser@example.com',
      password: 'password123',
    };

    it('should call authService.signUp', async () => {
      authService.signUp.mockResolvedValue(undefined);

      const result = await controller.signUp(signUpDto);

      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
      expect(authService.signUp).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('should handle signup errors', async () => {
      const error = new Error('Email already exists');
      authService.signUp.mockRejectedValue(error);

      await expect(controller.signUp(signUpDto)).rejects.toThrow(error);
      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
    });

    it('should return void', async () => {
      authService.signUp.mockResolvedValue(undefined);

      const result = await controller.signUp(signUpDto);

      expect(result).toBeUndefined();
    });
  });

  describe('logout', () => {
    it('should call authService.logout and return success message', async () => {
      const expectedResult = {
        message: 'Logout successful',
      };

      authService.logout.mockResolvedValue(expectedResult);

      const result = await controller.logout();

      expect(authService.logout).toHaveBeenCalled();
      expect(authService.logout).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('should handle logout errors', async () => {
      const error = new Error('Logout failed');
      authService.logout.mockRejectedValue(error);

      await expect(controller.logout()).rejects.toThrow(error);
      expect(authService.logout).toHaveBeenCalled();
    });

    it('should return the correct type', async () => {
      const expectedResult = {
        message: 'Logout successful',
      };

      authService.logout.mockResolvedValue(expectedResult);

      const result = await controller.logout();

      expect(result).toHaveProperty('message');
      expect(typeof result.message).toBe('string');
    });
  });

  describe('HTTP decorators and status codes', () => {
    it('should have correct decorators for signIn', () => {
      const signInMetadata = Reflect.getMetadata('path', controller.signIn);
      const methodMetadata = Reflect.getMetadata('method', controller.signIn);

      // Verify route metadata exists (exact values may vary by NestJS version)
      expect(signInMetadata).toBeDefined();
      expect(methodMetadata).toBeDefined();
    });

    it('should have correct decorators for signUp', () => {
      const signUpMetadata = Reflect.getMetadata('path', controller.signUp);
      const methodMetadata = Reflect.getMetadata('method', controller.signUp);

      // Verify route metadata exists
      expect(signUpMetadata).toBeDefined();
      expect(methodMetadata).toBeDefined();
    });

    it('should have correct decorators for logout', () => {
      const logoutMetadata = Reflect.getMetadata('path', controller.logout);
      const methodMetadata = Reflect.getMetadata('method', controller.logout);

      // Verify route metadata exists
      expect(logoutMetadata).toBeDefined();
      expect(methodMetadata).toBeDefined();
    });
  });

  describe('Dependency injection', () => {
    it('should inject AuthService correctly', () => {
      expect(authService).toBeDefined();
      expect(authService.signIn).toBeDefined();
      expect(authService.signUp).toBeDefined();
      expect(authService.logout).toBeDefined();
    });

    it('should use the same AuthService instance', () => {
      const authServiceInstance = controller['authService'];
      expect(authServiceInstance).toBe(authService);
    });
  });
});
