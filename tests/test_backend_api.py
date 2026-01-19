"""
Backend API Tests for 4you AI Hub
Tests the chat API endpoint with Emergent LLM Key integration
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthEndpoints:
    """Test basic API health and status endpoints"""
    
    def test_root_endpoint(self):
        """Test root API endpoint returns Hello World"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["message"] == "Hello World"
    
    def test_status_post(self):
        """Test status check POST endpoint"""
        response = requests.post(
            f"{BASE_URL}/api/status",
            json={"client_name": "TEST_client"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["client_name"] == "TEST_client"
        assert "timestamp" in data
    
    def test_status_get(self):
        """Test status check GET endpoint"""
        response = requests.get(f"{BASE_URL}/api/status")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestChatAPI:
    """Test the AI chat endpoint with Emergent LLM Key"""
    
    def test_chat_with_text_source(self):
        """Test chat endpoint with manual text source - AI should respond from source"""
        source_content = "الشركة القابضة تأسست عام 2024. الراتب الأساسي 15000 ريال. الإجازة السنوية 30 يوم."
        
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={
                "question": "كم الراتب الأساسي؟",
                "sources": [{
                    "name": "معلومات الشركة",
                    "content": source_content
                }]
            },
            timeout=60
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert "sessionId" in data
        # Verify AI responded (not empty)
        assert len(data["response"]) > 10
        # Check if response mentions salary info from source
        print(f"AI Response: {data['response'][:200]}...")
    
    def test_chat_with_multiple_sources(self):
        """Test chat with multiple text sources"""
        sources = [
            {"name": "سياسة الإجازات", "content": "الإجازة السنوية 30 يوم. إجازة المرض 15 يوم."},
            {"name": "سياسة الرواتب", "content": "الراتب يصرف يوم 25 من كل شهر. البدلات تشمل بدل سكن وبدل نقل."}
        ]
        
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={
                "question": "متى يصرف الراتب؟",
                "sources": sources
            },
            timeout=60
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert len(data["response"]) > 10
        print(f"Multi-source Response: {data['response'][:200]}...")
    
    def test_chat_session_persistence(self):
        """Test that session ID is returned and can be reused"""
        # First message
        response1 = requests.post(
            f"{BASE_URL}/api/chat",
            json={
                "question": "مرحبا",
                "sources": [{"name": "test", "content": "مرحبا بك في الشركة القابضة"}]
            },
            timeout=60
        )
        
        assert response1.status_code == 200
        data1 = response1.json()
        session_id = data1.get("sessionId")
        assert session_id is not None
        
        # Second message with same session
        response2 = requests.post(
            f"{BASE_URL}/api/chat",
            json={
                "question": "شكرا",
                "sources": [{"name": "test", "content": "شكرا لك"}],
                "sessionId": session_id
            },
            timeout=60
        )
        
        assert response2.status_code == 200
        data2 = response2.json()
        # Session ID should be preserved
        assert data2.get("sessionId") == session_id
    
    def test_chat_empty_sources(self):
        """Test chat with empty sources array"""
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={
                "question": "ما هي الشركة؟",
                "sources": []
            },
            timeout=60
        )
        
        # Should still return 200 but with appropriate message
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
    
    def test_chat_with_file_data_placeholder(self):
        """Test chat with file data (base64) - simulating PDF upload"""
        # Small base64 text file content
        import base64
        test_content = "هذا ملف اختبار للشركة القابضة. الراتب 20000 ريال."
        file_data = base64.b64encode(test_content.encode('utf-8')).decode('utf-8')
        
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={
                "question": "ما هو الراتب؟",
                "sources": [{
                    "name": "ملف اختبار",
                    "content": test_content,  # Also include text content
                    "fileData": file_data,
                    "mimeType": "text/plain"
                }]
            },
            timeout=60
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        print(f"File data response: {data['response'][:200]}...")


class TestChatAPIValidation:
    """Test input validation for chat API"""
    
    def test_chat_missing_question(self):
        """Test chat with missing question field"""
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={
                "sources": [{"name": "test", "content": "test content"}]
            },
            timeout=30
        )
        # Should return 422 for validation error
        assert response.status_code == 422
    
    def test_chat_missing_sources(self):
        """Test chat with missing sources field"""
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={
                "question": "test question"
            },
            timeout=30
        )
        # Should return 422 for validation error
        assert response.status_code == 422


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
