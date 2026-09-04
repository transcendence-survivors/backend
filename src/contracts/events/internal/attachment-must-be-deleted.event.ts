export class AttachmentMustBeDeletedEvent {
	constructor(public readonly attachmentUrls: string[]) {}
}
