import { db } from '@/lib/db';
import { CreateTopicInput, Topic } from '@/lib/types';

export async function getAllTopics(): Promise<Topic[]> {
  return db.topic.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      answers: {
        select: {
          id: true,
          content: true,
          score: true,
          isSelected: true,
        },
      },
    },
  });
}

export async function getActiveTopics(): Promise<Topic[]> {
  return db.topic.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      answers: {
        select: {
          id: true,
          content: true,
          score: true,
          isSelected: true,
        },
      },
    },
  });
}

export async function getTopicById(id: string): Promise<Topic | null> {
  return db.topic.findUnique({
    where: { id },
    include: {
      answers: {
        orderBy: {
          score: 'desc',
        },
      },
    },
  });
}

export async function createTopic(data: CreateTopicInput): Promise<Topic> {
  return db.topic.create({
    data: {
      content: data.content,
    },
  });
}

export async function updateTopicStatus(id: string, isActive: boolean): Promise<Topic> {
  return db.topic.update({
    where: { id },
    data: { isActive },
  });
}

export async function deleteTopic(id: string): Promise<void> {
  await db.topic.delete({
    where: { id },
  });
} 