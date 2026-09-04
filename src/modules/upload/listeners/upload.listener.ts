import { APP_EVENTS } from '@/contracts/events/internal';
import { AttachmentMustBeDeletedEvent } from '@/contracts/events/internal/attachment-must-be-deleted.event';
import { StorageService } from '@/core/storage/services/storage.service';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UploadListener {
	constructor(private readonly storageService: StorageService) {}

	@OnEvent(APP_EVENTS.ATTACHMENTS_MUST_BE_DELETED)
	async handleAttachmentsMustBeDeleted(event: AttachmentMustBeDeletedEvent) {
		await this.storageService.deleteMany(event.attachmentUrls);
	}
}
