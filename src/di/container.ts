/**
 * Dependency Injection Container
 * 
 * Centralizes all dependency management following Clean Architecture principles.
 * This is a singleton that manages the instantiation of all services, repositories,
 * and use cases in a controlled manner.
 */

import { ChatRepositoryImpl } from '../features/chat/data/repositories/ChatRepositoryImpl';
import { ChatRepository } from '../features/chat/domain/repositories/ChatRepository';
import { SendMessageUseCase } from '../features/chat/domain/usecases/SendMessageUseCase';

class DIContainer {
  private static instance: DIContainer;
  private repositories: Map<string, any> = new Map();
  private useCases: Map<string, any> = new Map();

  private constructor() {
    this.registerDependencies();
  }

  /**
   * Get or create singleton instance
   */
  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  /**
   * Register all dependencies
   */
  private registerDependencies(): void {
    // Data Layer - Repositories
    const chatRepository: ChatRepository = new ChatRepositoryImpl();
    this.repositories.set('ChatRepository', chatRepository);

    // Domain Layer - Use Cases
    const sendMessageUseCase = new SendMessageUseCase(chatRepository);
    this.useCases.set('SendMessageUseCase', sendMessageUseCase);
  }

  /**
   * Get repository by key
   */
  getRepository<T>(key: string): T {
    return this.repositories.get(key);
  }

  /**
   * Get use case by key
   */
  getUseCase<T>(key: string): T {
    return this.useCases.get(key);
  }

  /**
   * Get SendMessageUseCase
   */
  getSendMessageUseCase(): SendMessageUseCase {
    return this.getUseCase<SendMessageUseCase>('SendMessageUseCase');
  }
}

// Export singleton instance
export const diContainer = DIContainer.getInstance();
