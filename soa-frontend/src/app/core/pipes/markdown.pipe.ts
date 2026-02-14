import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'markdown', standalone: true })
export class MarkdownPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
    marked.setOptions({ breaks: true });
  }

  transform(value: string | null | undefined): SafeHtml {
    const html = marked.parse(value ?? '') as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}