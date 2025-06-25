from .registeraccountlogic import RegisterAccountLogic
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class RegisterAccountAppView(APIView):
    def post(self, request):
        serializer = RegisterAccountLogic(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"Registration Successful!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        return Response({"GET not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)