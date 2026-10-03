/**
 * OOP Demonstration: Report Entity
 * Encapsulates moderation reports submitted by students
 */

import { ReportReason, ReportStatus, ReportDTO } from './types';

export class Report {
  #reportID: string;
  #postID: string;
  #postTitle: string;
  #reporterID: string;
  #reporterName: string;
  #reporterEmail: string;
  #reason: ReportReason;
  #details: string;
  #reportDate: string;
  #status: ReportStatus;

  constructor(
    reportID: string,
    postID: string,
    postTitle: string,
    reporterID: string,
    reporterName: string,
    reporterEmail: string,
    reason: ReportReason,
    details: string = '',
    reportDate?: string,
    status: ReportStatus = 'PENDING'
  ) {
    this.#reportID = reportID;
    this.#postID = postID;
    this.#postTitle = postTitle;
    this.#reporterID = reporterID;
    this.#reporterName = reporterName;
    this.#reporterEmail = reporterEmail;
    this.#reason = reason;
    this.#details = details;
    this.#reportDate = reportDate || new Date().toISOString();
    this.#status = status;
  }

  public get reportID(): string {
    return this.#reportID;
  }

  public get postID(): string {
    return this.#postID;
  }

  public get postTitle(): string {
    return this.#postTitle;
  }

  public get reporterID(): string {
    return this.#reporterID;
  }

  public get reporterName(): string {
    return this.#reporterName;
  }

  public get reporterEmail(): string {
    return this.#reporterEmail;
  }

  public get reason(): ReportReason {
    return this.#reason;
  }

  public get details(): string {
    return this.#details;
  }

  public get reportDate(): string {
    return this.#reportDate;
  }

  public get status(): ReportStatus {
    return this.#status;
  }

  public resolve(): void {
    this.#status = 'RESOLVED';
  }

  public dismiss(): void {
    this.#status = 'DISMISSED';
  }

  public toDTO(): ReportDTO {
    return {
      reportID: this.#reportID,
      postID: this.#postID,
      postTitle: this.#postTitle,
      reporterID: this.#reporterID,
      reporterName: this.#reporterName,
      reporterEmail: this.#reporterEmail,
      reason: this.#reason,
      details: this.#details,
      reportDate: this.#reportDate,
      status: this.#status,
    };
  }

  public static fromDTO(dto: ReportDTO): Report {
    return new Report(
      dto.reportID,
      dto.postID,
      dto.postTitle,
      dto.reporterID,
      dto.reporterName,
      dto.reporterEmail,
      dto.reason,
      dto.details,
      dto.reportDate,
      dto.status
    );
  }
}
