from PIL import Image, ImageDraw, ImageFont

def create_icon(size, filename):
    img = Image.new('RGB', (size, size), color='#4f46e5')
    d = ImageDraw.Draw(img)
    # Just draw a simple "O" in white
    # We don't have a reliable font path, so we'll draw a circle for "O"
    margin = size * 0.2
    d.ellipse([(margin, margin), (size - margin, size - margin)], outline="white", width=int(size * 0.1))
    img.save(filename)

create_icon(192, 'c:/Users/jeico/onixlingo/language-ai-tutor/frontend/public/icon-192x192.png')
create_icon(512, 'c:/Users/jeico/onixlingo/language-ai-tutor/frontend/public/icon-512x512.png')
print("Icons generated successfully!")
