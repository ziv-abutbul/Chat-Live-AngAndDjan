from django.shortcuts import render
from rest_framework.response import Response  # ✅ נכון

from rest_framework.views import APIView
from .pusher import pusher_client

class MessageAPIView(APIView):
    """
    API view to handle messages.
    """

    def post(self, request):
        # Handle POST request
        pusher_client.trigger('chat', 'message', {
            'username': request.data['username'],
            'message': request.data['message'],
        })
        return Response([])
        #return render(request, 'chat/messages.html')
# Create your views here.
