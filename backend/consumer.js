//backend/consumer.js
console.log('Consumer script started');
import { consumeQueue } from './services/rabbitMqService.js';
consumeQueue();