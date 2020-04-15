import { Injectable } from "@nestjs/common";

@Injectable()
export class UtilsService {
    stripHtmlTags(html: string): string {
        // TODO: Improve convertion results
        if (typeof html !== 'string') return '';
        let raw = html.replace(/<(style|script)[^<>]*>.*?<\/\1>|<\/?[a-z][a-z0-9]*[^<>]*>|<!--.*?-->/ig, '');
        raw = raw.replace(/[\r\n]{2,}/ig, '\r\n\r\n');
        raw = raw.replace(/(^[\r\n\f\t\s]*|[\u2028\u2029\u0085\u000C\u000B]*|[\r\n\f\t\s]*$)/ig, '');
        return raw;
    }
}