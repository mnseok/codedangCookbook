type CustomFigureProps = {
    src: string;
    alt?: string;
    caption?: string;
};

export default function CustomFigure({ src, alt, caption }: CustomFigureProps) {
    return (
        <figure className="flex flex-col items-center my-6">
            <img src={src} alt={alt} className="max-w-full rounded-lg shadow-md" />
            {caption && <figcaption className="text-gray-600 text-sm mt-2">{caption}</figcaption>}
        </figure>
    );
}