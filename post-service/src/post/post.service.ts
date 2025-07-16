import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreateUpdatePostDto } from './dto/create-update-post.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ) { }

    async findByUserId(userId: string): Promise<Post[]> {
        const posts = await this.postRepository.find({ where: { userId } });
        return posts;
    }

    async create(userId: string, dto: CreateUpdatePostDto): Promise<Post> {
        const post = this.postRepository.create({ userId, ...dto });
        return this.postRepository.save(post);
    }

    async update(postId: number, dto: CreateUpdatePostDto): Promise<Post> {
        const post = await this.postRepository.findOneBy({ id: postId });
        if (!post) throw new NotFoundException(`Post with ID ${postId} not found`);
        post.title = dto.title;
        post.content = dto.content;
        return this.postRepository.save(post);
    }

    async delete(postId: number): Promise<void> {
        const result = await this.postRepository.delete({ id: postId });
        if (result.affected === 0) {
            throw new NotFoundException(`Post with ID ${postId} not found`);
        }
    }
}
