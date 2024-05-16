import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import os
from torchvision import models


class ResNet(nn.Module):
    def __init__(self, num_classes=6): 
        super(ResNet, self).__init__()
        self.network = models.resnet50(pretrained=False) 
        num_ftrs = self.network.fc.in_features
        self.network.fc = nn.Linear(num_ftrs, num_classes)

    def forward(self, xb):
        return self.network(xb)

def load_model(model_path):
    model = ResNet()  
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()
    return model

def predict_image(image_path, model):
    transformations = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.ToTensor()
    ])
    image = Image.open(image_path)
    image = transformations(image).unsqueeze(0)  
    with torch.no_grad():
        prediction = model(image)
        _, predicted_class = torch.max(prediction, 1)
    classes = ['paper', 'metal', 'cardboard', 'trash', 'glass', 'plastic'] 

if __name__ == "__main__":
    model = load_model('/home/daniel/myproject/model/material_classification_model.pth')
    test_image_path = '/home/daniel/myproject/captured_images/object_test.jpg'  
    predicted_class = predict_image(test_image_path, model)
    print(f"Predicted class: {predicted_class}")