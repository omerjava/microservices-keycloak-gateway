import { IsNotEmpty } from 'class-validator';

export class CreateUpdatePostDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    content: string;
}
