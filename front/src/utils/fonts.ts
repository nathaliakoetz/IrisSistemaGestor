import { Cairo } from 'next/font/google';
import { Inter } from 'next/font/google';

const cairo = Cairo({
    subsets: ['latin'],
    weight: ['200', '300', '400', '500','600', '700'],
});

const inter = Inter({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500','600', '700'],
});

export { cairo, inter };