from facenet_pytorch import MTCNN
from PIL import Image, ImageDraw

# Load an image
image = Image.open('test_image.jpg')

# Initialize MTCNN
mtcnn = MTCNN()

# Detect faces and landmarks
boxes, probs, landmarks = mtcnn.detect(image, landmarks=True)

# Draw boxes and landmarks on the image
draw = ImageDraw.Draw(image)
for box, landmark in zip(boxes, landmarks):
    draw.rectangle(box.tolist(), outline='red', width=2)
    for point in landmark:
        draw.ellipse((point[0] - 2, point[1] - 2, point[0] + 2, point[1] + 2), fill='blue')

# Display the image
image.show()
