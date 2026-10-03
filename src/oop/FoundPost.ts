/**
 * OOP Demonstration: Derived Subclass
 * FoundPost extends LostFoundPost
 */

import { LostFoundPost } from './LostFoundPost';
import { PostDTO } from './types';

export class FoundPost extends LostFoundPost {
  constructor(
    postID: string,
    ownerID: string,
    ownerName: string,
    ownerEmail: string,
    itemName: string,
    image: string,
    location: string,
    incidentDate: string,
    approximateTime: string,
    contactNumber: string,
    details: string,
    postedAt: string,
    status: 'ACTIVE' | 'RESOLVED' = 'ACTIVE'
  ) {
    super(
      postID,
      ownerID,
      ownerName,
      ownerEmail,
      'FOUND',
      itemName,
      image,
      location,
      incidentDate,
      approximateTime,
      contactNumber,
      details,
      postedAt,
      status
    );
  }

  public override getBadgeColor(): string {
    return 'bg-[#16325C] text-white'; // iTECH Navy
  }

  public override getActionLabel(): string {
    return 'Is this yours? Contact Finder';
  }

  public static fromDTO(dto: PostDTO): FoundPost {
    return new FoundPost(
      dto.postID,
      dto.ownerID,
      dto.ownerName,
      dto.ownerEmail,
      dto.itemName,
      dto.image,
      dto.location,
      dto.incidentDate,
      dto.approximateTime,
      dto.contactNumber,
      dto.details,
      dto.postedAt,
      dto.status
    );
  }
}
