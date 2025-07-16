import { Controller, Get, Post as HttpPost, Put, Delete, Body, Headers, Param } from '@nestjs/common';
import { PostService } from './post.service';
import { CreateUpdatePostDto } from './dto/create-update-post.dto';
import { Post as PostEntity } from './post.entity';

@Controller('/posts')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Get()
    async getMyPosts(@Headers('X-User-Sub') userId: string): Promise<PostEntity[]> {
        return this.postService.findByUserId(userId);
    }

    @HttpPost()
    async createMyPost(
        @Headers('X-User-Sub') userId: string,
        @Body() dto: CreateUpdatePostDto,
    ): Promise<PostEntity> {
        return this.postService.create(userId, dto);
    }

    @Put(':id')
    async updatePost(
        @Param('id') id: number,
        @Body() dto: CreateUpdatePostDto,
    ): Promise<PostEntity> {
        return this.postService.update(id, dto);
    }

    @Delete(':id')
    async deletePost(@Param('id') id: number): Promise<void> {
        return this.postService.delete(id);
    }
}