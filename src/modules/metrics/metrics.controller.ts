import { PrometheusController } from '@willsoto/nestjs-prometheus';
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from '../auth/auth.decorator';

@Controller()
export class MetricsController extends PrometheusController {
	@Get()
	@Public()
	async index(@Res() response: Response) {
		await super.index(response);
	}
}
