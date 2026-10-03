/**
 * OOP Demonstration: Derived Subclass
 * LostPost extends LostFoundPost
 */

import { LostFoundPost } from './LostFoundPost';
import { PostDTO } from './types';

export class LostPost extends LostFoundPost {
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
      'LOST',
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
    return 'bg-[#A82024] text-white'; // iTECH Crimson
  }

  public override getActionLabel(): string {
    return 'Found this item? Contact Owner';
  }

  public static fromDTO(dto: PostDTO): LostPost {
    return new LostPost(
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
