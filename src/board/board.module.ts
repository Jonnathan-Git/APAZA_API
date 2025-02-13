import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FirebaseService } from 'src/data/storage';
import { ImageService } from 'src/logic/storage.logic';
import { Board, BoardSchema } from './schema/Board.schema';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Board.name,
      schema: BoardSchema,
    }])
  ],
  providers: [ImageService,FirebaseService, BoardService], 
  controllers: [BoardController]
})
export class BoardModule {}
