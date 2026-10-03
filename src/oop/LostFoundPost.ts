/**
 * OOP Demonstration: Abstract Base Class for Posts
 * Demonstrates: Encapsulation, State Management, Validation
 */

import { PostType, PostStatus, PostDTO } from './types';

export abstract class LostFoundPost {
  // Encapsulated private fields
  #postID: string;
  #ownerID: string;
  #ownerName: string;
  #ownerEmail: string;
  #type: PostType;
  #itemName: string;
  #image: string;
  #location: string;
  #incidentDate: string;
  #approximateTime: string;
  #contactNumber: string;
  #details: string;
  #postedAt: string;
  #status: PostStatus;

  constructor(
    postID: string,
    ownerID: string,
    ownerName: string,
    ownerEmail: string,
    type: PostType,
    itemName: string,
    image: string,
    location: string,
    incidentDate: string,
    approximateTime: string,
    contactNumber: string,
    details: string,
    postedAt: string,
    status: PostStatus = 'ACTIVE'
  ) {
    if (!itemName?.trim()) throw new Error('Please enter an item name.');
    if (!location?.trim()) throw new Error('Please provide the location.');

    this.#postID = postID;
    this.#ownerID = ownerID;
    this.#ownerName = ownerName;
    this.#ownerEmail = ownerEmail;
    this.#type = type;
    this.#itemName = itemName.trim();
    this.#image = image;
    this.#location = location.trim();
    this.#incidentDate = incidentDate || new Date().toISOString().split('T')[0];
    this.#approximateTime = approximateTime || 'Not specified';
    this.#contactNumber = contactNumber || '';
    this.#details = details || '';
    this.#postedAt = postedAt || LostFoundPost.generateTimestamp();
    this.#status = status;
  }

  // --- Getters (Encapsulation) ---
  public get postID(): string {
    return this.#postID;
  }

  public get ownerID(): string {
    return this.#ownerID;
  }

  public get ownerName(): string {
    return this.#ownerName;
  }

  public get ownerEmail(): string {
    return this.#ownerEmail;
  }

  public get type(): PostType {
    return this.#type;
  }

  public get itemName(): string {
    return this.#itemName;
  }

  public get image(): string {
    return this.#image;
  }

  public get location(): string {
    return this.#location;
  }

  public get incidentDate(): string {
    return this.#incidentDate;
  }

  public get approximateTime(): string {
    return this.#approximateTime;
  }

  public get contactNumber(): string {
    return this.#contactNumber;
  }

  public get details(): string {
    return this.#details;
  }

  public get postedAt(): string {
    return this.#postedAt;
  }

  public get status(): PostStatus {
    return this.#status;
  }

  /**
   * Parses the human-readable postedAt string ("03 October 2026, 08:35 PM")
   * into epoch milliseconds so posts can be sorted chronologically.
   * Falls back to Date.parse for ISO strings, and 0 if unparseable.
   */
  public getPostedAtMillis(): number {
    const m = /^(\d{1,2}) ([A-Za-z]+) (\d{4}), (\d{1,2}):(\d{2}) (AM|PM)$/.exec(this.#postedAt);
    if (m) {
      const months = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december',
      ];
      const monthIdx = months.indexOf(m[2].toLowerCase());
      if (monthIdx >= 0) {
        let h = parseInt(m[4], 10) % 12;
        if (m[6] === 'PM') h += 12;
        return new Date(parseInt(m[3], 10), monthIdx, parseInt(m[1], 10), h, parseInt(m[5], 10)).getTime();
      }
    }
    const parsed = Date.parse(this.#postedAt);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  public isResolved(): boolean {
    return this.#status === 'RESOLVED';
  }

  // --- State Transitions & Mutations (Encapsulated) ---
  public markResolved(): void {
    this.#status = 'RESOLVED';
  }

  public reopenPost(): void {
    this.#status = 'ACTIVE';
  }

  public update(data: {
    itemName?: string;
    image?: string;
    location?: string;
    incidentDate?: string;
    approximateTime?: string;
    contactNumber?: string;
    details?: string;
  }): void {
    if (data.itemName !== undefined) {
      if (!data.itemName.trim()) throw new Error('Please enter an item name.');
      this.#itemName = data.itemName.trim();
    }
    if (data.location !== undefined) {
      if (!data.location.trim()) throw new Error('Please provide the location.');
      this.#location = data.location.trim();
    }
    if (data.image !== undefined) this.#image = data.image;
    if (data.incidentDate !== undefined) this.#incidentDate = data.incidentDate;
    if (data.approximateTime !== undefined) this.#approximateTime = data.approximateTime;
    if (data.contactNumber !== undefined) this.#contactNumber = data.contactNumber;
    if (data.details !== undefined) this.#details = data.details;
  }

  /**
   * Search evaluation method (Encapsulation of search logic)
   */
  public matchesQuery(query: string): boolean {
    if (!query || !query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
      this.#itemName.toLowerCase().includes(q) ||
      this.#location.toLowerCase().includes(q) ||
      this.#details.toLowerCase().includes(q)
    );
  }

  // --- Abstract Polymorphic Behavior ---
  public abstract getBadgeColor(): string;
  public abstract getActionLabel(): string;

  public toDTO(): PostDTO {
    return {
      postID: this.#postID,
      ownerID: this.#ownerID,
      ownerName: this.#ownerName,
      ownerEmail: this.#ownerEmail,
      type: this.#type,
      itemName: this.#itemName,
      image: this.#image,
      location: this.#location,
      incidentDate: this.#incidentDate,
      approximateTime: this.#approximateTime,
      contactNumber: this.#contactNumber,
      details: this.#details,
      postedAt: this.#postedAt,
      status: this.#status,
    };
  }

  /**
   * Generates exact university formatted timestamp:
   * e.g., "03 October 2026, 08:35 PM"
   */
  public static generateTimestamp(): string {
    const now = new Date();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const day = String(now.getDate()).padStart(2, '0');
    const month = months[now.getMonth()];
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 hour is 12
    const strHours = String(hours).padStart(2, '0');

    return `${day} ${month} ${year}, ${strHours}:${minutes} ${ampm}`;
  }
}
