import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';

class UserController {
    async create(request: Request, response: Response){
        const { name, email } = request.body;

        const schema = yup.object().shape({
            name: yup.string().required(),
            enail: yup.string().email().required()
        })
        
        if(!(await !schema.isValid(request.body))) {
            return response.status(400).json({error: "Validation failed!"});
        }

        const usersRepository = getCustomRepository(UsersRepository);

        const userAlreadyExists = await usersRepository.findOne({
            email,
        });

        if (userAlreadyExists) {
            return response.status(400).json({
                error: "Email already used.",
            });
        }

        const user = usersRepository.create({
            name, 
            email,
        });

        await usersRepository.save(user);

        return response.status(201).json(user);
    }
}

export { UserController }